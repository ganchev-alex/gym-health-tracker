import { useSelector } from "react-redux";
import { RootState } from "../../features/store";

const WalkingIcon: React.FC = () => {
  const { isMale } = useSelector((state: RootState) => state.userActions);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="61"
      height="60"
      viewBox="0 0 61 60"
      fill="none"
    >
      <rect
        x="2"
        y="1.5"
        width="57"
        height="57"
        rx="23.5"
        stroke="url(#paint0_linear_145_220)"
        strokeWidth="3"
      />
      <path
        d="M33.4341 19.3954C35.2473 19.3954 36.7308 17.9243 36.7308 16.1263C36.7308 14.3283 35.2473 12.8572 33.4341 12.8572C31.6209 12.8572 30.1374 14.3283 30.1374 16.1263C30.1374 17.9243 31.6209 19.3954 33.4341 19.3954ZM27.3352 24.9528L23.1154 46.0549C22.9011 47.052 23.6924 48 24.7308 48H24.8627C25.6374 48 26.2967 47.477 26.4781 46.7251L29.1484 34.9236L32.6099 38.1927V46.3655C32.6099 47.2645 33.3517 48 34.2583 48C35.1649 48 35.9066 47.2645 35.9066 46.3655V37.1466C35.9066 36.2476 35.544 35.3976 34.8847 34.7765L32.4451 32.4718L33.4341 27.5681C35.1978 29.595 37.7528 31.0497 40.6209 31.5074C41.6099 31.6545 42.5 30.8699 42.5 29.8728C42.5 29.0719 41.9066 28.4017 41.0989 28.271C38.5934 27.8623 36.5165 26.3913 35.4121 24.4625L33.7638 21.8472C32.8407 20.3924 30.9945 19.804 29.3956 20.4742L23.0825 23.1221C21.8627 23.6452 21.0715 24.8221 21.0715 26.1461V30.02C21.0715 30.919 21.8132 31.6545 22.7198 31.6545C23.6264 31.6545 24.3682 30.919 24.3682 30.02V26.097L27.3352 24.9528Z"
        fill="url(#paint1_linear_145_220)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_145_220"
          x1="0.499999"
          y1="65.1429"
          x2="66.0714"
          y2="2.57143"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={isMale ? "#472ed8" : "#D385E6"} />
          <stop offset="1" stopColor={isMale ? "#29156B" : "#E54C60"} />
        </linearGradient>
        <linearGradient
          id="paint1_linear_145_220"
          x1="52.7858"
          y1="6.00002"
          x2="2.64289"
          y2="64.2857"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={isMale ? "#29156B" : "#E54C60"} />
          <stop offset="1" stopColor={isMale ? "#472ed8" : "#D385E6"} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default WalkingIcon;
