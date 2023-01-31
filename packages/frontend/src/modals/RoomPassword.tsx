import { faClose, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Props as InputProps } from '../components/form/Input';
import InputPassword from '../components/form/InputPassword';
import Modal, { ChildProps } from '../components/Modal';
import { useSelector } from '../store';

interface Props extends ChildProps {
    roomId: string
    cancel: VoidFunction
    onChange: InputProps['onChange']
}

export default function ModalRoomPassword(props: Props) {
    return (
        <Modal
            {...props}
            title="Room Unlock"
            subtitle={`Access Room #${props.roomId}`}
            close={() => props.cancel()}
            actions={[
                {
                    label: 'Cancel',
                    icon: faClose,
                    handle: () => props.cancel(),
                },
                {
                    label: 'Access',
                    icon: faLockOpen,
                    handle: () => props.close(),
                },
            ]}
        >
            <p className="mb-4">
                Enter the password below required to access Room #{props.roomId}.
            </p>
            <InputPassword
                name="password"
                label="Password"
                onChange={props.onChange}
            />
        </Modal>
    )
}
