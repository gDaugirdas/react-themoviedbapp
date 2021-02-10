import React from 'react';
import './Loader.scss';

export default function Loader() {
  return (
    <svg
      className="loader__icon"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 100 100"
    >
      <circle cx="30" cy="50" r="20" fill="#f5c318">
        <animate
          attributeName="cx"
          begin="-0.5s"
          dur="1s"
          keyTimes="0;0.5;1"
          repeatCount="indefinite"
          values="30;70;30"
        />
      </circle>
      <circle cx="70" cy="50" r="20" fill="#cf1717">
        <animate
          attributeName="cx"
          begin="0s"
          dur="1s"
          keyTimes="0;0.5;1"
          repeatCount="indefinite"
          values="30;70;30"
        />
      </circle>
      <circle cx="30" cy="50" r="20" fill="#f5c318">
        <animate
          attributeName="cx"
          begin="-0.5s"
          dur="1s"
          keyTimes="0;0.5;1"
          repeatCount="indefinite"
          values="30;70;30"
        />
        <animate
          attributeName="fill-opacity"
          calcMode="discrete"
          dur="1s"
          keyTimes="0;0.499;0.5;1"
          repeatCount="indefinite"
          values="0;0;1;1"
        />
      </circle>
    </svg>
  );
}
