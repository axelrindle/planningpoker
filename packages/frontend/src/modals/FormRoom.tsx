import { faCheck, faClose, faSave } from '@fortawesome/free-solid-svg-icons'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import Form from '../components/form/Form'
import Input from '../components/form/Input'
import InputPassword from '../components/form/InputPassword'
import InputToggleable from '../components/form/InputToggleable'
import Modal, { ChildProps } from '../components/Modal'
import { createRoom, updateRoom } from '../query/room'
import { useSelector } from '../store'
import { FormData } from '../store/slices/formData'
import { FormError } from '../util/error'

const FORMDATA_KEY = 'form_room'

type Mode = 'create' | 'edit'
interface Props extends ChildProps {
    mode: Mode
    room?: any
}

export default function ModalFormRoom(props: Props) {
    const isCreate = props.mode === 'create'

    const formData = useSelector(state => state.formData[FORMDATA_KEY])
    const apiUrl = useSelector(state => state.config.apiUrl)

    const queryClient = useQueryClient()
    const mutation: UseMutationResult<Response, FormError, FormData> = useMutation({
        mutationFn: isCreate ? createRoom(apiUrl) : updateRoom(apiUrl, props.room?.id),
        onSuccess: (_res, _v, _c) => {
            queryClient.invalidateQueries({
                queryKey: ['rooms']
            })
            props.close()
        }
    })

    return (
        <Modal
            isOpen={props.isOpen}
            disableClose={props.disableClose}
            close={props.close}
            title={isCreate ? 'New Room' : 'Edit Room'}
            subtitle={isCreate ? 'Create a new Room' : 'Edit Room #' + props.room?.id}
            actions={[
                {
                    label: 'Cancel',
                    icon: faClose,
                    handle: props.close,
                },
                {
                    label: isCreate ? 'Create' : 'Save',
                    icon: isCreate ? faCheck : faSave,
                    handle: () => mutation.mutate(formData),
                },
            ]}
        >
            <Form
                name={FORMDATA_KEY}
                mutation={mutation}
                preFill={isCreate ? undefined : props.room}
            >
                <Input
                    type="text"
                    name="name"
                    label="Name"
                    placeholder="My awesome room"
                />

                <InputToggleable
                    type="number"
                    name="userLimit"
                    label="Limit"
                    help="userLimit the user count of a Room. Use the checkbox on the right to disable."
                    min={2}
                    disabled={isCreate ? true : !props.room?.userLimit}
                />

                <Input
                    type="text"
                    name="description"
                    label="Description"
                    placeholder="My awesome room is so awesome"
                    help="What is this Room all about?"
                    containerClassName="col-span-2"
                />

                <InputPassword
                    name="password"
                    label="Password"
                    help="Leave empty to create a public room."
                />
            </Form>
        </Modal>
    )
}
