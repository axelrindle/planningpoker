import { ChangeEvent, useCallback, useState } from 'react'
import { useTus } from 'use-tus'
import { useSelector } from '../store'

export default function PageUpload() {
    const { upload, setUpload, isSuccess, error, remove } = useTus()
    const [hasFile, setHasFile] = useState(false)
    const [progress, setProgress] = useState(0)
    const apiUrl = useSelector(state => state.config.apiUrl)

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
            endpoint: `${apiUrl}/upload`,
            metadata: {
                filename: file.name,
                filetype: file.type,
            },
            onProgress(bytesSent, bytesTotal) {
                setProgress((bytesSent / bytesTotal) * 100)
            },
        })
    }, [setUpload, apiUrl])

    const handleStart = useCallback(() => {
        if (!upload) {
            return
        }

        upload.start()
    }, [upload])

    return (
        <div className="flex flex-col items-start gap-4">
            <input type="file" onChange={handleSetUpload} />
            <button
                type="button"
                onClick={handleStart}
                className="
                    bg-primary text-white px-8 py-4 rounded cursor-pointer
                    disabled:cursor-not-allowed disabled:bg-gray-400
                "
                disabled={!hasFile}
            >
                Upload
            </button>
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
        </div>
    )
}
