import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Input from '../components/form/Input'
import InputPassword from '../components/form/InputPassword'
import Modal, { ChildProps } from '../components/Modal'
import { createRoom } from '../query/room'
import { useDispatch, useSelector } from '../store'
import { clearFormData, FormData } from '../store/slices/formData'
import { FormError, getError } from '../util/error'

const FORMDATA_KEY = 'room_create'

interface Props extends ChildProps {}

export default function ModalCreateRoom(props: Props) {
    const formData = useSelector(state => state.formData[FORMDATA_KEY])
    const apiUrl = useSelector(state => state.config.apiUrl)
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const mutation = useMutation<Response, FormError, FormData>({
        mutationFn: createRoom(apiUrl),
        onSuccess: (_res, _v, _c) => {
            queryClient.invalidateQueries({
                queryKey: ['rooms']
            })
            props.close()
            dispatch(clearFormData(FORMDATA_KEY))
        }
    })

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
                    error={getError(mutation, 'name')}
                />

                <Input
                    type="number"
                    name="limit"
                    label="Limit"
                    formData={FORMDATA_KEY}
                    help="Limit the user count of a Room. Set to 0 to disable."
                    error={getError(mutation, 'limit')}
                    min={2}
                />

                <Input
                    type="text"
                    name="description"
                    label="Description"
                    placeholder="My awesome room is so awesome"
                    formData={FORMDATA_KEY}
                    error={getError(mutation, 'description')}
                    containerClassName="col-span-2"
                />

                <InputPassword
                    name="password"
                    label="Password"
                    help="Leave empty to create a public room."
                    formData={FORMDATA_KEY}
                    error={getError(mutation, 'password')}
                />
            </div>
        </Modal>
    )
}
