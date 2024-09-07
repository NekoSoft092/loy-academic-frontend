import './loader-component.css'

export enum LoaderSize {
    SMALL, 
    MEDIUM, 
    LARGE 
}

export interface ILoaderComponentProps {
    size: LoaderSize
    color?: string
}

export function LoaderComponent(props: ILoaderComponentProps): JSX.Element {
    return (
        <div className="loader-container">
            {props.size === LoaderSize.SMALL && (
                <a className="loader small"></a>
            )}
            {props.size === LoaderSize.MEDIUM && (
                <a className="loader medium"></a>
            )}
            {props.size === LoaderSize.LARGE && (
                <a className="loader large"></a>
            )}
        </div>
    )
}