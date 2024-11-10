import { Fragment, useRef, useState } from "react";
import { Button as Button_, Dropdown } from "react-daisyui";
import { Title } from "./Text";
import { XIcon } from "@heroicons/react/outline";

import { Info } from "./Alerts";

const Spinner = ({ className }) => {
  return (
    <svg
      ariaHidden="true"
      className={`w-6 h-6 text-primary animate-spin fill-text/60 ${className}`}
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );
};

export const Button = ({
  className,
  icon,
  onClick,
  spinnerClassName,
  size = "sm",
  ...props
}) => {
  const [spin, setSpin] = useState(false);

  return spin ? (
    <Spinner className={spinnerClassName + " mx-auto"} />
  ) : (
    <Button_
      onClick={async (e) => {
        if (typeof onClick !== "function") return;
        try {
          setSpin(true);
          await onClick(e);
          setSpin(false);
        } catch (e) {
          console.log(e);
          setSpin(false);
        }
      }}
      endIcon={icon}
      animation={true}
      size={size}
      responds={true}
      className={`text-light bg-primary border-none outline-1 outline-offset-2 outline-dashed outline-primary hover:bg-primary/90 rounded-lg text-sm font-semibold px-3.5 capitalize ${className}  `}
      {...props}
    />
  );
};

export const RoundedButton = ({
  className,
  onClick,
  spinnerClassName,
  children,
}) => {
  const [spin, setSpin] = useState(false);

  return spin ? (
    <Spinner className={" text-text/60 " + spinnerClassName} />
  ) : (
    <button
      className={`flex items-center justify-center text-text/60 outline-dashed outline-1 outline-offset-2 outline-text/20 h-9 aspect-square rounded-full p-0.5 hover:bg-current/10 ${className}  `}
      onClick={async (e) => {
        if (typeof onClick !== "function") return;
        setSpin(true);
        await onClick(e);
        setSpin(false);
      }}
    >
      {children}
    </button>
  );
};

export function CloseButton({ className, onClick }) {
  return (
    <Button_
      size="xs"
      shape="circle"
      className={`${className} bg-transparent text-text/30 hover:text-text hover:bg-transparent border-text/30 hover:border-text/60`}
      onClick={onClick}
    >
      <XIcon className="h-3.5 aspect-square cursor-pointer" />
    </Button_>
  );
}

export const ButtonText = ({
  className,
  icon,
  startIcon,
  onClick,
  spinnerClassName,
  ...props
}) => {
  const [spin, setSpin] = useState(false);

  return spin ? (
    <Spinner
      className={
        spinnerClassName + " text-text/20 h-5 min-w-[4rem] flex items-center"
      }
    />
  ) : (
    <Button_
      onClick={async (e) => {
        if (typeof onClick !== "function") return;
        setSpin(true);
        await onClick(e);
        setSpin(false);
      }}
      startIcon={startIcon}
      endIcon={icon}
      animation={false}
      // variant="link"
      size="sm"
      responds={true}
      className={`capitalize outline-0 bg-transparent outline-dashed outline-current hover:bg-text/10 px-2.5 !text-sm font-normal rounded-lg hover:no-underline border-none disabled:bg-transparent ${className}  `}
      {...props}
    />
  );
};

export const ButtonInfo = ({
  className,
  onClick,
  children,
  helper,
  onMouseLeave,
}) => {
  return (
    <Dropdown hover={true} horizontal="left" vertical="top" className="">
      <RoundedButton
        shape="circle"
        className={`${className} text-info`}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </RoundedButton>
      <Dropdown.Menu className="w-auto !p-0 !m-0 shadow">
        <Info className="whitespace-nowrap">{helper}</Info>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export const ButtonFile = ({
  className,
  children,
  uploadChildren,
  onSelect,
  icon,
  ...props
}) => {
  const ref = useRef(null);
  const [upload, setUpload] = useState(false);

  return (
    <Fragment>
      <input
        className="hidden"
        type="file"
        ref={ref}
        accept="image/png, image/jpeg, image/jpg, image/gif"
        onChange={async (e) => {
          if (!upload) {
            setUpload(true);
            await onSelect(e);
            setUpload(false);
          }
        }}
      />

      <Button_
        onClick={() => ref.current.click()}
        variant="link"
        startIcon={icon}
        animation={true}
        size="sm"
        responds={true}
        className={`${className} capitalize text-text-h`}
        {...props}
      >
        {upload ? uploadChildren : children}
      </Button_>
    </Fragment>
  );
};