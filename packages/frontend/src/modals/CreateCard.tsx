import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Input from '../components/form/Input'
import Modal, { ChildProps } from '../components/Modal'
import { createCard } from '../query/card'
import { useDispatch, useSelector } from '../store'
import { clearFormData, FormData } from '../store/slices/formData'
import { FormError, getError } from '../util/error'

const FORMDATA_KEY = 'card_create'

interface Props extends ChildProps {}

export default function ModalCreateCard(props: Props) {
    const formData = useSelector(state => state.formData[FORMDATA_KEY])
    const apiUrl = useSelector(state => state.config.apiUrl)
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const mutation = useMutation<Response, FormError, FormData>({
        mutationFn: createCard(apiUrl),
        onSuccess: (_res, _v, _c) => {
            queryClient.invalidateQueries({
                queryKey: ['cards']
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
            title="New Card"
            subtitle="Create a new Card"
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
                    placeholder="Card No. 5"
                    formData={FORMDATA_KEY}
                    help="A unique name for this card. Use the value for simplicity or something special."
                    error={getError(mutation, 'name')}
                />

                <Input
                    type="number"
                    name="value"
                    label="Card Value"
                    formData={FORMDATA_KEY}
                    help="The numeric value of this card. Must be positive."
                    error={getError(mutation, 'value')}
                    min={2}
                />
            </div>
        </Modal>
    )
}
