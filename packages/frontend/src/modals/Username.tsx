import { faClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Input from '../components/form/Input';
import Modal, { ChildProps } from '../components/Modal';
import { useDispatch, useSelector } from '../store';
import { setUsername } from '../store/slices/config';

interface Props extends ChildProps {}

export default function ModalUsername(props: Props) {
    const username = useSelector(state => state.config.username)
    const [input, setInput] = useState(username)
    const dispatch = useDispatch()

    return (
        <Modal
            title="Username"
            subtitle="Change your username which is displayed to other users."
            close={props.close}
            isOpen={props.isOpen}
            disableClose={props.disableClose}
            actions={[
                {
                    label: 'Cancel',
                    icon: faClose,
                    handle: () => props.close()
                },
                {
                    label: 'Save',
                    icon: faSave,
                    handle: () => {
                        dispatch(setUsername(input))
                        props.close()
                    }
                }
            ]}
        >
            <Input
                type="text"
                name="username"
                label="Username"
                help="Choose a username. People typically user the first or full name."
                defaultValue={input}
                onChange={e => setInput(e.target.value)}
            />
        </Modal>
    )
}
