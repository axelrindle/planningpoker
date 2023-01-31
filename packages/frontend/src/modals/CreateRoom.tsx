import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Input from '../components/form/Input'
import InputPassword from '../components/form/InputPassword'
import Modal, { ChildProps } from '../components/Modal'
import { useDispatch, useSelector } from '../store'
import { clearFormData, FormData } from '../store/slices/formData'
import { FormError } from '../util/error'

const FORMDATA_KEY = 'room_create'

interface Props extends ChildProps {}

export default function ModalCreateRoom(props: Props) {
    const formData = useSelector(state => state.formData[FORMDATA_KEY])
    const apiUrl = useSelector(state => state.config.apiUrl)
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const mutation = useMutation<Response, FormError, FormData>({
        mutationFn: async (data) => {
            const response = await fetch(new URL('/api/room', apiUrl), {
                body: JSON.stringify(data),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            switch (response.status) {
                case 200:
                    return response
                case 400:
                    const details = await response.json()
                    throw new FormError(details)
                default:
                    throw new Error('Request failed!')
            }
        },
        onSuccess: (res, _v, _c) => {
            queryClient.invalidateQueries({
                queryKey: ['rooms']
            })
            props.close()
            dispatch(clearFormData(FORMDATA_KEY))
        }
    })

    function getError(key: string): string | undefined {
        if (!mutation.error?.details) return undefined
        if (!Array.isArray(mutation.error?.details)) return undefined

        const detail = mutation.error.details.find(el => el.param === key)
        return detail?.msg
    }

    return (
        <Modal
            isOpen={props.isOpen}
            disableClose={props.disableClose}
            close={() => props.close()}
            title="New Room"
            subtitle="Create a new Room"
            actions={[
                {
                    label: 'Cancel',
                    icon: faClose,
                    handle: () => props.close(),
                },
                {
                    label: 'Create',
                    icon: faCheck,
                    handle: () => mutation.mutate(formData),
                },
            ]}
        >
            <div className="grid grid-cols-2 gap-4">
                <Input
                    type="text"
                    name="name"
                    label="Name"
                    placeholder="My awesome room"
                    formData={FORMDATA_KEY}
                    error={getError('name')}
                />

                <Input
                    type="number"
                    name="limit"
                    label="Limit"
                    formData={FORMDATA_KEY}
                    help="Limit the user count of a Room. Set to 0 to disable."
                    error={getError('limit')}
                    min={2}
                />

                <Input
                    type="text"
                    name="description"
                    label="Description"
                    placeholder="My awesome room is so awesome"
                    formData={FORMDATA_KEY}
                    error={getError('description')}
                    containerClassName="col-span-2"
                />

                <InputPassword
                    name="password"
                    label="Password"
                    help="Leave empty to create a public room."
                    formData={FORMDATA_KEY}
                    error={getError('password')}
                />
            </div>
        </Modal>
    )
}
