import { ThemeProvider, Pane, defaultTheme, classicTheme } from "evergreen-ui"
import Button from "./Button"
import Tab from "./Tab"
import styles from "./Theme.module.css"

function Theme(props) {
  let defTheme:any = defaultTheme;
  let palette:string = props.palette;
  let colorTheme;

  const hoagieUI = {
    ...defTheme,
    title: "blue",
    colors: {
      //...defTheme.colors,
      gray900: "#000000",
      gray800: "#343434",
      gray700: "#808080",
      gray600: "#808080",
      gray500: "#D2D2D2",
      gray400: "#D2D2D2",
      gray300: "#EEEEEE",
      gray200: "#F1F1F1",
      gray100: "#F7F7F7",
      gray90: "#FBFBFB",
      gray75: "#FCFCFC",
      gray50: "#FFFFFF",
      blue900: "#0A1433",
      blue800: "#142966",
      blue700: "#1F3D99",
      blue600: "#2952CC",
      blue500: "#3366FF",
      blue400: "#5C85FF",
      blue300: "#85A3FF",
      blue200: "#ADC2FF",
      blue100: "#D6E0FF",
      blue50: "#EBF0FF",
      blue25: "#F3F6FF",
      red700: "#7D2828",
      red600: "#A73636",
      red500: "#D14343",
      red300: "#EE9191",
      red100: "#F9DADA",
      red25: "#FDF4F4",
      green900: "#10261E",
      green800: "#214C3C",
      green700: "#317159",
      green600: "#429777",
      green500: "#52BD95",
      green400: "#75CAAA",
      green300: "#97D7BF",
      green200: "#BAE5D5",
      green100: "#DCF2EA",
      green25: "#F5FBF8",
      orange700: "#996A13",
      orange500: "#FFB020",
      orange100: "#F8E3DA",
      orange25: "#FFFAF2",
      purple600: "#6E62B6",
      purple100: "#E7E4F9",
      teal800: "#0F5156",
      teal100: "#D3F5F7",
      yellow800: "#66460D",
      yellow100: "#FFEFD2",
      muted: "#808080",
      default: "#343434",
      dark: "#000000",
      selected: "#3366FF",
      tint1: "#FAFBFF",
      tint2: "#F9FAFC",
      overlay: "rgba(100, 100, 100, 0.7)",
      yellowTint: "#FFEFD2",
      greenTint: "#F5FBF8",
      orangeTint: "#FFFAF2",
      redTint: "#FDF4F4",
      blueTint: "#F3F6FF",
      purpleTint: "#E7E4F9",
      tealTint: "#D3F5F7",
      border: {
          default: "#EEEEEE",
          muted: "#F1F1F1"
      },
      icon: {
          default: "#808080",
          muted: "#D2D2D2",
          disabled: "#D2D2D2",
          selected: "#3366FF"
      },
      text: {
          danger: "#D14343",
          success: "#52BD95",
          info: "#3366FF"
      },
      'hoagie-orange': '#DE7548',
    },
    fills: {
      neutral: {
          color: "#343434",
          backgroundColor: "#F1F1F1"
      },
      blue: {
          color: "#2952CC",
          backgroundColor: "#D6E0FF"
      },
      red: {
          color: "#7D2828",
          backgroundColor: "#F9DADA"
      },
      orange: {
          color: "#996A13",
          backgroundColor: "#F8E3DA"
      },
      yellow: {
          color: "#66460D",
          backgroundColor: "#FFEFD2"
      },
      green: {
          color: "#317159",
          backgroundColor: "#DCF2EA"
      },
      teal: {
          color: "#0F5156",
          backgroundColor: "#D3F5F7"
      },
      purple: {
          color: "#6C47AE",
          backgroundColor: "#E9DDFE"
      }
    },
    intents: {
      info: {
          background: "#F3F6FF",
          border: "#3366FF",
          text: "#2952CC",
          icon: "#3366FF"
      },
      success: {
          background: "#F5FBF8",
          border: "#52BD95",
          text: "#317159",
          icon: "#52BD95"
      },
      warning: {
          background: "#FFFAF2",
          border: "#FFB020",
          text: "#996A13",
          icon: "#FFB020"
      },
      danger: {
          background: "#FDF4F4",
          border: "#D14343",
          text: "#A73636",
          icon: "#D14343"
      }
    },
    radii: {
      0: "0px",
      1: "4px",
      2: "8px" 
    },
    shadows: {
      0: "0 0 1px rgba(100, 100, 100, 0.3)",
      1: "0 0 1px rgba(100, 100, 100, 0.3), 0 2px 4px -2px rgba(100, 100, 100, 0.47)",
      2: "0 0 1px rgba(100, 100, 100, 0.3), 0 5px 8px -4px rgba(100, 100, 100, 0.47)",
      3: "0 0 1px rgba(100, 100, 100, 0.3), 0 8px 10px -4px rgba(100, 100, 100, 0.47)",
      4: "0 0 1px rgba(100, 100, 100, 0.3), 0 16px 24px -8px rgba(100, 100, 100, 0.47)",
      focusRing: "0 0 0 2px #D6E0FF"
    },
    fontFamilies: {
      display: "\"Inter\", \"SF UI Display\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"",
      ui: "\"Inter\", \"SF UI Text\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"",
      mono: "\"JetBrains Mono\", \"SF Mono\", \"Monaco\", \"Inconsolata\", \"Fira Mono\", \"Droid Sans Mono\", \"Source Code Pro\", monospace"
    },
    fontSizes: {
      "0": "10px",
      "1": "12px",
      "2": "14px",
      "3": "16px",
      "4": "18px",
      "5": "20px",
      "6": "24px",
      "7": "32px",
      "body": "14px",
      "caption": "10px",
      "heading": "16px"
    },
    fontWeights: {
      "light": 300,
      "normal": 400,
      "semibold": 500,
      "bold": 600
    },
    components: {
      ...defTheme.components,
      Tab
      // Button,
    },
  }

  const hoagiePurple = {
    ...hoagieUI,  
    title: "purple",
    colors: {
      ...hoagieUI.colors,
      blue900: "#190c30",
      blue800: "#351E5C",
      blue700: "#58427F",
      blue600: "#6C47AE",
      blue500: "#8F59EF",
      blue400: "#A472FC",
      blue300: "#BFA0F4",
      blue200: "#D1BAF7",
      blue100: "#E9DDFE",
      blue50: "#F5F0FF",
      blue25: "#F9F5FF",
      selected: "#8F59EF",
      tint1: "#FCFAFF",
      tint2: "#FAF9FC",
      border: {
          default: "#EEEEEE",
          muted: "#F1F1F1"
      },
      icon: {
          default: "#808080",
          muted: "#D2D2D2",
          disabled: "#D2D2D2",
          selected: "#8F59EF"
      },
      text: {
          danger: "#D14343",
          success: "#52BD95",
          info: "#8F59EF"
      },
    },
    intents: {
      info: {
          background: "#F9F5FF",
          border: "#8F59EF",
          text: "#6C47AE",
          icon: "#8F59EF"
      },
      success: {
          background: "#F5FBF8",
          border: "#52BD95",
          text: "#317159",
          icon: "#52BD95"
      },
      warning: {
          background: "#FFFAF2",
          border: "#FFB020",
          text: "#996A13",
          icon: "#FFB020"
      },
      danger: {
          background: "#FDF4F4",
          border: "#D14343",
          text: "#A73636",
          icon: "#D14343"
      }
    },
    shadows: {
      0: "0 0 1px rgba(100, 100, 100, 0.3)",
      1: "0 0 1px rgba(100, 100, 100, 0.3), 0 2px 4px -2px rgba(100, 100, 100, 0.47)",
      2: "0 0 1px rgba(100, 100, 100, 0.3), 0 5px 8px -4px rgba(100, 100, 100, 0.47)",
      3: "0 0 1px rgba(100, 100, 100, 0.3), 0 8px 10px -4px rgba(100, 100, 100, 0.47)",
      4: "0 0 1px rgba(100, 100, 100, 0.3), 0 16px 24px -8px rgba(100, 100, 100, 0.47)",
      focusRing: "0 0 0 2px #E9DDFE"
    },
  }

  switch (palette) {
    case 'purple':
      colorTheme = hoagiePurple;
      break;
    case 'blue':
      colorTheme = hoagieUI;
      break;
    default:
      colorTheme = hoagieUI;
  }

  // document.body.style.backgroundColor = colorTheme.colors.blue100;

  return (
    <ThemeProvider value={colorTheme}>
      <Pane className={styles.document}>
        {props.children}
      </Pane>
    </ThemeProvider>
  )
}

export default Theme