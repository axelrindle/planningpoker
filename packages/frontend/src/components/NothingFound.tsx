import illustrationVoid from '../assets/illustrations/undraw_void_-3-ggu.svg'

interface Props {
    entity: string
    add: () => void
}

export default function NothingFound(props: Props) {
    return (
        <div className="flex flex-col items-center justify-center gap-8">
            <img
                src={illustrationVoid}
                className="w-60"
                alt="man looking into the void"
            />
            <div className="text-center">
                <p className="font-bold text-lg mb-2">
                    Seems like there are no {props.entity} ...
                </p>
                <p
                    className="underline cursor-pointer"
                    onClick={props.add}
                >
                    Why not create one?
                </p>
            </div>
        </div>
    )
}
