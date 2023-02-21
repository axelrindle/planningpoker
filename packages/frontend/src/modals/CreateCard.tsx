import { faCheck, faClose, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { Stepper } from 'react-form-stepper'
import { StepDTO } from 'react-form-stepper/dist/components/Step/StepTypes.js'
import { useTus } from 'use-tus'
import Form, { FormProps, useFormRef } from '../components/form/Form'
import Input from '../components/form/Input'
import Modal, { ChildProps } from '../components/Modal'
import { createCard, updateCard } from '../query/card'
import { useSelector } from '../store'
import { FormData, FormError } from '../types'

const steps: StepDTO[] = [
    {
        label: 'General Information'
    },
    {
        label: 'Image Upload'
    },
    {
        label: 'Done'
    }
]

interface Props extends ChildProps {}

export function FormCard(props: FormProps) {
    return (
        <Form {...props}>
            <Input
                type="text"
                name="name"
                label="Name"
                placeholder="Card No. 5"
                help="A unique name for this card. Use the value for simplicity or something special."
            />

            <Input
                type="number"
                name="value"
                label="Card Value"
                help="The numeric value of this card. Must be positive."
                min={2}
            />
        </Form>
    )
}

export default function ModalCreateCard(props: Props) {
    const apiUrl = useSelector(state => state.config.apiUrl)
    const queryClient = useQueryClient()
    const [cardId, setCardId] = useState(-1)
    const mutationCreate = useMutation<Response, FormError, FormData>({
        mutationFn: createCard(apiUrl),
        onSuccess: async (res, _v, _c) => {
            const body = await res.json()
            setCardId(body.id)
            setActiveStep(activeStep + 1)
        }
    })
    const mutationUpdate = useMutation<Response, FormError, FormData>({
        mutationFn: updateCard(apiUrl, cardId),
        onSuccess: (_res, _v, _c) => {
            setActiveStep(activeStep + 1)
            queryClient.invalidateQueries({
                queryKey: ['cards']
            })
        }
    })

    const [activeStep, setActiveStep] = useState(0)

    const { upload, setUpload, error } = useTus()
    const [hasFile, setHasFile] = useState(false)
    const [progress, setProgress] = useState(0)

    const formCreate = useFormRef()

    const handleSetUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) {
            setHasFile(false)
            return
        }

        const file = files.item(0)
        if (!file) {
            setHasFile(false)
            return
        }
        setHasFile(true)

        setUpload(file, {
            endpoint: `${apiUrl}/upload/card`,
            metadata: {
                filename: file.name,
                filetype: file.type,
            },
            onProgress(bytesSent, bytesTotal) {
                setProgress((bytesSent / bytesTotal) * 100)
            },
            async onAfterResponse(req, res) {
                const response = res.getUnderlyingObject() as XMLHttpRequest
                if (response.status === 204) {
                    const split = response.responseURL.split('/')
                    const hash = split[split.length - 1]
                    await mutationUpdate.mutateAsync({
                        image: hash
                    })
                }
            },
        })
    }, [setUpload, apiUrl, mutationUpdate])

    const handleStart = useCallback(() => {
        if (!upload) {
            return
        }

        upload.start()
    }, [upload])

    const { close } = props
    const handleClose = useCallback(() => {
        close()
        setActiveStep(0)
        mutationCreate.reset()
        mutationUpdate.reset()
    }, [close, mutationCreate, mutationUpdate])
    const disableClose = useMemo(() => activeStep > 0 && activeStep < steps.length, [activeStep])

    return (
        <Modal
            isOpen={props.isOpen}
            disableClose={disableClose}
            close={() => handleClose()}
            title="New Card"
            subtitle="Create a new Card"
            actions={[
                {
                    label: 'Cancel',
                    icon: faClose,
                    handle: () => handleClose(),
                    disabled: disableClose,
                    hidden: activeStep === 2
                },
                {
                    label: () => {
                        switch (activeStep) {
                            case 1: return 'Upload'
                            case 2: return 'Close'
                            default: return 'Create'
                        }
                    },
                    icon: faCheck,
                    handle: () => {
                        switch (activeStep) {
                            case 0:
                                formCreate.current?.submit()
                                break
                            case 1:
                                handleStart()
                                break
                            case 2:
                                handleClose()
                                break
                            default:
                                break
                        }
                    },
                    disabled: activeStep === 1 && !hasFile
                },
                {
                    label: 'Create another Card',
                    icon: faRepeat,
                    handle: () => setActiveStep(0),
                    hidden: activeStep !== 2
                },
            ]}
        >
            <Stepper
                activeStep={activeStep}
                steps={steps}
            />

            {activeStep === 0 && (
                <FormCard
                    mutation={mutationCreate}
                    formRef={formCreate}
                />
            )}

            {activeStep === 1 && (
                <>
                    <Input
                        type="file"
                        name="image"
                        label="Card Image"
                        help="An image which resembles the value of the new card."
                        onChange={handleSetUpload}
                    />
                    {progress > 0 && (
                        <p>
                            Progress: {progress}%
                        </p>
                    )}
                    {error && (
                        <p>
                            Error: {error.message}
                        </p>
                    )}
                </>
            )}
        </Modal>
    )
}
