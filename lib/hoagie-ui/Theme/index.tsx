import { ThemeProvider, Pane, defaultTheme } from "evergreen-ui"
import Button from "./Button"
import styles from "./Theme.module.css"

function Theme(props) {
    let defTheme:any = defaultTheme

    const hoagieUI = {
      ...defTheme,
      colors: {
        ...defTheme.colors,
        'hoagie-orange': '#DE7548',
      },
      components: {
        ...defTheme.components,
        Button,
        },
      }
  
    return (
      <ThemeProvider value={hoagieUI}>
        <Pane className={styles.document}>
          {props.children}
        </Pane>
      </ThemeProvider>
    )
}

export default Theme