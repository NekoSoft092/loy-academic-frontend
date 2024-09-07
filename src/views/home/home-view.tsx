
import { onWeb } from '@/lib/windows';

export function HomeView(): JSX.Element {


    return (
    <div className={onWeb(window)? '' : 'sage-view' }>
                
    </div>
    )
}