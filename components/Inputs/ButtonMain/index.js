import buttonStyles from './ButtonMain.module.scss'

    export default function ButtonMain({variant='purple',textSize='normal',children,...props}) {
        const checkVariant = (variant) => {
                switch (variant) {
                        case 'blue':
                                return buttonStyles.td_blue_button;
                            case 'red':
                                return buttonStyles.td_red_button;
                            case 'purple':
                                return buttonStyles.td_purple_button;
                            case 'yellow':
                                return buttonStyles.td_yellow_button;
                            case 'white':
                                return buttonStyles.td_white_button;
                        }
            }
        const checkSize = (textSize) => {
                switch (textSize) {
                        case 'large':
                                return buttonStyles.td_button_large;
                        }
            }
        return (
                    <button className={`${buttonStyles.td_button} ${checkVariant(variant)} ${checkSize(textSize)}`} {...props}>
                            {children}
                        </button>
                )
        }