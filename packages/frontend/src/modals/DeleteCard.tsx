import { faClose, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal, { ChildProps } from '../components/Modal';
import { useSelector } from '../store';

interface Props extends ChildProps {
    card: any
}

export default function ModalDeleteCard(props: Props) {
    const apiUrl = useSelector(state => state.config.apiUrl)
    const queryClient = useQueryClient()
    const mutation = useMutation<Response, any, number>({
        mutationFn: (roomId) => fetch(new URL('/api/card/' + roomId, apiUrl), {
            method: 'DELETE',
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['cards']
            })
            props.close()
        }
    })
    return (
        <Modal
            isOpen={props.isOpen}
            disableClose={props.disableClose}
            close={() => props.close()}
            title="Room Deletion"
            subtitle={`Delete Card #${props.card?.id}`}
            actions={[
                {
                    label: 'Cancel',
                    icon: faClose,
                    handle: () => props.close(),
                },
                {
                    label: 'Delete',
                    icon: faTrash,
                    handle: () => mutation.mutate(props.card?.id),
                },
            ]}
        >
            <p>
                Please be absolutely sure before deleting the Card #{props.card?.name}.
                This action cannot be undone and the associated image will also be deleted.
            </p>
        </Modal>
    )
}
