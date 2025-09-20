export default {
  red: {
    header: {
      bg: '#D32F2F',
      text: '#fff'
    },
    launcher: {
      bg: '#D32F2F'
    },
    messageList: {
      bg: '#fff'
    },
    sentMessage: {
      bg: '#F44336',
      text: '#fff'
    },
    receivedMessage: {
      bg: '#eaeaea',
      text: '#222222'
    },
    userInput: {
      bg: '#fff',
      text: '#212121'
    },
    userList: {
      bg: '#fff',
      text: '#212121'
    }
  },
  green: {
    header: {
      bg: '#388E3C',
      text: '#fff'
    },
    launcher: {
      bg: '#388E3C'
    },
    messageList: {
      bg: '#fff'
    },
    sentMessage: {
      bg: '#4CAF50',
      text: '#fff'
    },
    receivedMessage: {
      bg: '#eaeaea',
      text: '#222222'
    },
    userInput: {
      bg: '#fff',
      text: '#212121'
    },
    userList: {
      bg: '#fff',
      text: '#212121'
    }
  },
  dark: {
    header: {
      bg: '#466281',
      text: '#ecf0f1'
    },
    launcher: {
      bg: '#466281'
    },
    messageList: {
      bg: '#466281'
    },
    sentMessage: {
      bg: '#7f8c8d',
      text: '#ecf0f1'
    },
    receivedMessage: {
      bg: '#95a5a6',
      text: '#ecf0f1'
    },
    userInput: {
      bg: '#34495e',
      text: '#ecf0f1'
    },
    userList: {
      bg: '#2c3e50',
      text: '#ecf0f1'
    }
  },
  blue: {
    errorInfo: {
      bg: '#ffffff',
      text: '#D32F2F',
    },
    header: {
      bg: '#4e8cff',
      text: '#ffffff',
      bgError: '#D32F2F'
    },
    launcher: {
      bg: '#4e8cff',
      bgError: '#D32F2F'
    },
    messageList: {
      bg: '#ffffff'
    },
    sentMessage: {
      bg: '#4e8cff',
      text: '#ffffff'
    },
    receivedMessage: {
      bg: '#eaeaea',
      text: '#222222'
    },
    userInput: {
      bg: '#f4f7f9',
      text: '#565867'
    },
    userList: {
      bg: '#fff',
      text: '#212121'
    }
  },
  /* dumb me... this is javascript so no var()
  brand: {
    errorInfo: {
      bg: '#ffffff',
      text: '#D32F2F',
    },
    header: {
      bg: var(--ezee-public-chat--brand-color),
      text: '#ffffff',
      bgError: '#D32F2F'
    },
    launcher: {
      bg: var(--ezee-public-chat--brand-color),
      bgError: '#D32F2F'
    },
    messageList: {
      bg: '#ffffff'
    },
    sentMessage: {
      bg: var(--ezee-public-chat--brand-color),
      text: '#ffffff'
    },
    receivedMessage: {
      bg: '#eaeaea',
      text: '#222222'
    },
    userInput: {
      bg: '#fff',
      text: '#212121'
    },
    userList: {
      bg: '#fff',
      text: '#212121'
    }
  },
  */
}


export function invertColor(hex, bw=false) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // https://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
