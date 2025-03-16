import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="loader my-3">
      <div className="light"></div>
      <div className="black_overlay"></div>

      <style>{`
        .loader {
          height: 2px;
          width: 300px;
          background: rgb(44, 44, 44);
          position: relative;
          overflow: hidden;
        }
        .loader .black_overlay {
          background: linear-gradient(
            87deg,
            rgb(0, 0, 0) 0%,
            rgba(0, 0, 0, 0.14) 30%,
            rgba(0, 0, 0, 0.14) 70%,
            rgb(0, 0, 0) 100%
          );
          position: absolute;
          inset: 0px;
        }
        .loader .light {
          width: 70px;
          height: 100%;
          position: absolute;
          left: -20%;
          top: 0px;
          background: linear-gradient(
            87deg,
            rgba(0, 0, 0, 0) 0%,
            #00FFFF 40%, /* Brighter cyan */
            #00FFFF 60%, /* Brighter cyan */
            rgba(0, 0, 0, 0) 100%
          );
          animation: light 2s infinite ease-in-out;
          filter: brightness(150%) drop-shadow(0 0 10px #00FFFF); /* Glow effect */
        }

        @keyframes light {
          from {
            left: -30%;
          }
          to {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
