"use client";

import { Input } from "@nextui-org/input";
import { EyeFilledIcon } from "@/assets/icons/eye_filled_icon";
import { EyeSlashFilledIcon } from "@/assets/icons/eye_filled_slahed_icon";
import { type ComponentProps, useState } from "react";

type PasswordInputProps = Omit<
  Omit<ComponentProps<typeof Input>, "type">,
  "endContent"
>;

export default function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Input
      type={showPassword ? "text" : "password"}
      {...props}
      endContent={
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label="Toggle password visibility"
        >
          {!showPassword ? (
            <EyeSlashFilledIcon className="text-default-400 pointer-events-none text-2xl transition duration-150 hover:text-black" />
          ) : (
            <EyeFilledIcon className="text-default-400 pointer-events-none text-2xl transition duration-150 hover:text-black" />
          )}
        </button>
      }
    />
  );
}
