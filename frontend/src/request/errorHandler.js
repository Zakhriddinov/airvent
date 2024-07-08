import { notification } from "antd";
import codeMessage from "./codeMessage";

const errorHandler = (error) => {
  if (!navigator.onLine) {
    notification.config({
      duration: 15,
      maxCount: 1,
    });
    // Internet aloqasi yo'q bo'lganda bajariladigan kod
    notification.error({
      message: "Internet aloqasi yo'q",
      description:
        "Internetga ulanib bo'lmayapti, Internet tarmog'ingizni tekshiring",
    });
    return {
      success: false,
      result: null,
      message:
        "Serverga ulanib bo'lmayapti, Internet tarmog'ingizni tekshiring",
    };
  }

  const { response } = error;

  if (!response) {
    notification.config({
      duration: 20,
      maxCount: 1,
    });
    // Serverga ulanishda muammo bo'lganda bajariladigan kod
    notification.error({
      message: "Server bilan ulanishda muammo",
      description: "Serverga ulanib bo'lmayapti, Keyinroq qayta urinib ko'ring",
    });
    return {
      success: false,
      result: null,
      message:
        "Serverga ulanib bo'lmayapti, Hisob administratoringiz bilan bog'laning",
    };
  }

  if (response && response.data && response.data.jwtExpired) {
    const result = window.localStorage.getItem("auth");
    const jsonFile = window.localStorage.getItem("isLogout");
    const { isLogout } = (jsonFile && JSON.parse(jsonFile)) || false;
    window.localStorage.removeItem("auth");
    window.localStorage.removeItem("isLogout");
    if (result || isLogout) {
      window.location.href = "/logout";
    }
  }

  if (response && response.status) {
    const message = response.data && response.data.message;

    const errorText = message || codeMessage[response.status];
    const { status } = response;
    notification.config({
      duration: 20,
      maxCount: 2,
    });
    notification.error({
      message: `So'rovda xato ${status}`,
      description: errorText,
    });
    return response.data;
  } else {
    notification.config({
      duration: 15,
      maxCount: 1,
    });

    if (navigator.onLine) {
      // Internet aloqasi mavjud bo'lganda bajariladigan kod
      notification.error({
        message: "Server bilan ulanishda muammo",
        description:
          "Serverga ulanib bo'lmayapti, Keyinroq qayta urinib ko'ring",
      });
      return {
        success: false,
        result: null,
        message:
          "Serverga ulanib bo'lmayapti, Hisob administratoringiz bilan bog'laning",
      };
    } else {
      // Internet aloqasi yo'q bo'lganda bajariladigan kod
      notification.error({
        message: "Internet aloqasi yo'q",
        description:
          "Internetga ulanib bo'lmayapti, Internet tarmog'ingizni tekshiring",
      });
      return {
        success: false,
        result: null,
        message:
          "Serverga ulanib bo'lmayapti, Internet tarmog'ingizni tekshiring",
      };
    }
  }
};

export default errorHandler;
