import { ThemeProvider, defaultTheme } from "evergreen-ui"

function Everpurple(props) {
    let defTheme:any = defaultTheme

    const everPurple = {
      ...defTheme,
      components: {
        ...defTheme.components,
        
        Button: {
          // sizes: {
          //   small: {
          //     paddingX: 14,
          //     paddingY:28
          //   },
          // },

          ...defTheme.components.Button,
          baseStyle: {
            paddingX: 12,
            paddingY: 8,
            borderRadius: 5,
          },
          appearances: {
              primary: {
              color: 'white',
              backgroundColor: '#6459ab',
              _hover: {
                backgroundColor: '#595099',
              },
              _active: {
                backgroundColor: '#4b418a',
              },
              _focus: {
                boxShadow: '0 0 0 2px #E7E4F9',
              },
            },
          },

        },
      }
    }
  
    return (
      <ThemeProvider value={everPurple}>
          {props.children}
      </ThemeProvider>
    )
  }

  export default Everpurple