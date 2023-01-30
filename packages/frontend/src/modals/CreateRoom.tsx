import { faCheck, faClose, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import Input from '../components/form/Input'
import Modal, { ChildProps } from '../components/Modal'
import { useDispatch, useSelector } from '../store'
import { clearFormData, FormData } from '../store/slices/formData'

const FORMDATA_KEY = 'room_create'

interface Props extends ChildProps {}

export default function ModalCreateRoom(props: Props) {
    const [showPassword, setShowPassword] = useState(false)
    const formData = useSelector(state => state.formData[FORMDATA_KEY])
    const apiUrl = useSelector(state => state.config.apiUrl)
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const mutation = useMutation<Response, any[], FormData>({
        mutationFn: data => fetch(new URL('/api/room', apiUrl), {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['rooms']
            })
            props.close()
            dispatch(clearFormData(FORMDATA_KEY))
        }
    })

    function getError(key: string): string | undefined {
        if (!mutation.error) return undefined
        if (!Array.isArray(mutation.error)) return undefined

        const detail = mutation.error.find(el => el.context.key === key)
        return detail.message
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
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    label="Password"
                    help="Leave empty to create a public room."
                    formData={FORMDATA_KEY}
                    contentAfter={(
                        <div
                            className="flex justify-center items-center w-8"
                            title="Toggle password visibility"
                        >
                            <FontAwesomeIcon
                                icon={showPassword ? faEye : faEyeSlash}
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-xl text-primary cursor-pointer dark:text-white"
                            />
                        </div>
                    )}
                />

                <Input
                    type="text"
                    name="description"
                    label="Description"
                    placeholder="My awesome room is so awesome"
                    formData={FORMDATA_KEY}
                    containerClassName="col-span-2"
                />
            </div>
        </Modal>
    )
}
