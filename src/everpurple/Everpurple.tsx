import { ThemeProvider, defaultTheme } from "evergreen-ui"

function Everpurple(props) {
    let defTheme:any = defaultTheme

    const everPurple = {
      ...defTheme,
      colors: {
        ...defTheme.colors,
        hoagie: '#DE7548',
      },
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
            color: 'white',
            background: '#272727',
          },
          appearances: {
              primary: {
              color: 'white',
              backgroundColor: '#DE7548',
              _hover: {
                backgroundColor: '#EE703B',
              },
              _active: {
                backgroundColor: '#CE6C42',
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