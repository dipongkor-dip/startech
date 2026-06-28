import {env} from "../env";

export const sendLocalSMS = async (userPhone: string, otpCode: string) => {
  // ১. বাংলাদেশি ফরম্যাটে ফোন নম্বরটি ফিক্স করা (যেমন: 017XXXXXXXX)
  const formattedPhone = userPhone.replace("+88", "");

  const message = `Your OTP code is ${otpCode}. It is valid for 5 minutes. Do not share it with anyone.`;

  // URLSearchParams ব্যবহার করে অবজেক্টকে কুয়েরি স্ট্রিং-এ রূপান্তর
  const queryParams = new URLSearchParams({
    token: env.sms.gateway_token || "", // আপনার সিক্রেট এপিআই টোকেন
    to: formattedPhone,
    message: message,
  }).toString();

  // ফুল ইউআরএল তৈরি করা হচ্ছে (যেমন: https://api.greenweb.com.bd/api.php?token=...&to=...)
  const fullUrl = `${env.sms.gateway_url}?${queryParams}`;

  try {
    const response = await fetch(fullUrl, {
      method: "GET",
    });

    // রেসপন্স টেক্সট ফরম্যাটে পড়া (কারণ অনেক দেশি গেটওয়ে সরাসরি JSON না দিয়ে শুধু "Ok" বা ID রিটার্ন করে)
    const data = await response.text();

    if (!response.ok) {
      throw new Error(`Gateway responded with status: ${response.status}`);
    }

    console.log("SMS Gateway Response:", data);
    return data;
  } catch (error) {
    console.error("SMS Sending Error:", error);
    throw new Error("Failed to deliver OTP SMS via local gateway");
  }
};
