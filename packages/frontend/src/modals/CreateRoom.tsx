import { faCheck, faClose, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useState } from 'react';
import Input from '../components/form/Input';
import Modal, { ChildProps } from '../components/Modal';
import { useDispatch, useSelector } from '../store';
import { clearFormData } from '../store/slices/formData'

const FORMDATA_KEY = 'room_create'

interface Props extends ChildProps {}

async function sendRequest(api: string, data: Record<string, any>): Promise<void> {
    const response = await fetch(new URL('/api/room', api), {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok || response.status !== 200) {
        return Promise.reject('Error creating a Room! ' + response.statusText)
    }
}

export default function ModalCreateRoom(props: Props) {
    const [error, setError] = useState<string|null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const formData = useSelector(state => state.formData[FORMDATA_KEY])
    const apiUrl = useSelector(state => state.config.apiUrl)
    const dispatch = useDispatch()

    const { close } = props
    const onSave = useCallback(async () => {
        try {
            setError(null)
            await sendRequest(apiUrl, formData)
            close()
            dispatch(clearFormData(FORMDATA_KEY))
        } catch (error: any) {
            setError(error.message ?? error ?? 'Unknown error!')
        }
    }, [apiUrl, formData, close, dispatch])

    return (
        <Modal
            isOpen={props.isOpen}
            disableClose={props.disableClose}
            close={() => close()}
            title="New Room"
            subtitle="Create a new Room"
            actions={[
                {
                    label: 'Cancel',
                    icon: faClose,
                    handle: () => close(),
                },
                {
                    label: 'Create',
                    icon: faCheck,
                    handle: () => onSave(),
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
                />

                <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    label="Password"
                    help="Leave empty to create a public room."
                    formData={FORMDATA_KEY}
                    contentAfter={(
                        <div className="flex justify-center items-center w-8">
                            <FontAwesomeIcon
                                icon={showPassword ? faEye : faEyeSlash}
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-xl text-primary cursor-pointer"
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
            {error && (
                <p className="text-red-500">
                    {error}
                </p>
            )}
        </Modal>
    )
}
