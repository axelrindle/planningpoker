import { faClose, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal, { ChildProps } from '../components/Modal';
import { useSelector } from '../store';

interface Props extends ChildProps {
    roomId: number
}

export default function ModalDeleteRoom(props: Props) {
    const apiUrl = useSelector(state => state.config.apiUrl)
    const queryClient = useQueryClient()
    const mutation = useMutation<Response, any, number>({
        mutationFn: (roomId) => fetch(new URL('/api/room/' + roomId, apiUrl), {
            method: 'DELETE',
        }),
        onSuccess: () => {
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
            close={() => props.close()}
            title="Room Deletion"
            subtitle={`Delete Room #${props.roomId}`}
            actions={[
                {
                    label: 'Cancel',
                    icon: faClose,
                    handle: () => props.close(),
                },
                {
                    label: 'Delete',
                    icon: faTrash,
                    handle: () => mutation.mutate(props.roomId),
                },
            ]}
        >
            <p>
                Please be absolutely sure before deleting Room #{props.roomId}.
                This action cannot be undone and every user will be kicked out.
            </p>
        </Modal>
    )
}
