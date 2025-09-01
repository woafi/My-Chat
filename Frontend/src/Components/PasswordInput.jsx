import { useState, forwardRef } from "react";

const PasswordInput = forwardRef(({ icon, ...rest }, ref) => {
  const [isShown, setIsShown] = useState(false);

  const handleShownPassword = () => setIsShown((prev) => !prev);

  return (
    <div>
      {icon ? (
        <div className="input-box">
          <input
            type="password"
            ref={ref}            
            {...rest}
          />
          <i className="bx bxs-lock-alt" onClick={handleShownPassword}></i>
        </div>
      ) : (
        <div className="input-box">
          <input
            type={isShown ? "text" : "password"}
            ref={ref}            
            {...rest}
          />
          <i
            className={isShown ? "bx bx-show" : "bx bx-hide"}
            onClick={handleShownPassword}
          ></i>
        </div>
      )}
    </div>
  );
});

export default PasswordInput;
