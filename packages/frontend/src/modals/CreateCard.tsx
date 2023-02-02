import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, useCallback, useState } from 'react'
import { Stepper } from 'react-form-stepper'
import { StepDTO } from 'react-form-stepper/dist/components/Step/StepTypes.js'
import { useTus } from 'use-tus'
import Input from '../components/form/Input'
import Modal, { ChildProps } from '../components/Modal'
import { createCard, updateCard } from '../query/card'
import { useDispatch, useSelector } from '../store'
import { clearFormData, FormData } from '../store/slices/formData'
import { FormError, getError } from '../util/error'

const FORMDATA_KEY = 'card_create'

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

export default function ModalCreateCard(props: Props) {
    const formData = useSelector(state => state.formData[FORMDATA_KEY])
    const apiUrl = useSelector(state => state.config.apiUrl)
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const [cardId, setCardId] = useState(-1)
    const mutationCreate = useMutation<Response, FormError, FormData>({
        mutationFn: createCard(apiUrl),
        onSuccess: async (res, _v, _c) => {
            const body = await res.json()
            setCardId(body.id)
            setActiveStep(activeStep + 1)
            dispatch(clearFormData(FORMDATA_KEY))
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
                console.log(response.status)
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

    const disableClose = activeStep > 0 && activeStep < steps.length

    return (
        <Modal
            isOpen={props.isOpen}
            disableClose={disableClose}
            close={() => props.close()}
            title="New Card"
            subtitle="Create a new Card"
            actions={[
                {
                    label: 'Cancel',
                    icon: faClose,
                    handle: () => props.close(),
                    disabled: disableClose
                },
                {
                    label: () => {
                        switch (activeStep) {
                            case 1: return 'Upload'
                            case 2: return 'Finish'
                            default: return 'Create'
                        }
                    },
                    icon: faCheck,
                    handle: () => {
                        switch (activeStep) {
                            case 0:
                                mutationCreate.mutate(formData)
                                break
                            case 1:
                                handleStart()
                                break
                            case 2:
                                props.close()
                                setActiveStep(0)
                                break
                            default:
                                break
                        }
                    },
                    disabled: activeStep === 1 && !hasFile
                },
            ]}
        >
            <Stepper
                activeStep={activeStep}
                steps={steps}
            />

            {activeStep === 0 && (
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        type="text"
                        name="name"
                        label="Name"
                        placeholder="Card No. 5"
                        formData={FORMDATA_KEY}
                        help="A unique name for this card. Use the value for simplicity or something special."
                        error={getError(mutationCreate, 'name')}
                    />

                    <Input
                        type="number"
                        name="value"
                        label="Card Value"
                        formData={FORMDATA_KEY}
                        help="The numeric value of this card. Must be positive."
                        error={getError(mutationCreate, 'value')}
                        min={2}
                    />
                </div>
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
