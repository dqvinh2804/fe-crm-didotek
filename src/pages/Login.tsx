import authApi from "@/apis/modules/auth.api";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Images } from "@/constant";
import AuthContext from "@/context/Auth/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, User } from "lucide-react";
import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface ModifyPassword {
  type: "password" | "text";
  icon: typeof Eye | typeof EyeClosed;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [modifyPassword, setModifyPassword] = useState<ModifyPassword>({
    type: "password",
    icon: EyeClosed,
  });
  const handleModifyPassword = () => {
    if (modifyPassword.type === "password") {
      setModifyPassword({
        type: "text",
        icon: Eye,
      });
    } else {
      setModifyPassword({
        type: "password",
        icon: EyeClosed,
      });
    }
  };
  // Cấu hình Zod schema
  const loginSchema = z.object({
    username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  });

  type loginFormData = z.infer<typeof loginSchema>;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<loginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const authMethod = useContext(AuthContext);

  const onSubmit = async (data: loginFormData) => {
    setLoading(true);
    try {
      //call api in here...
      const userInfo = await authApi.login(data.username, data.password);

      if (userInfo) {
        console.log(userInfo);
        authMethod?.login(userInfo);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      reset();
      setError("password", {
        type: "manual",
        message: "username or password is incorrect",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="h-screen w-screen bg-background-overlay/5 flex justify-center">
        <div className="h-full flex flex-col justify-center items-center w-[500px] space-y-8">
          <img
            src={Images.mainLogo.url}
            alt={Images.mainLogo.name}
            className="object-contain max-w-[150px]"
          />
          <div className="w-full xl:p-10 bg-white space-y-4 shadow-lg">
            <div>
              <h2 className="text-2xl font-bold text-black mb-2">Đăng nhập</h2>
              <p className="text-sm">
                Vui lòng đăng nhập bằng tên đăng nhập và mật khẩu của bạn.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="py-4 text-sm">
              <div className="mb-4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Tên đăng nhập
                </label>
                <Controller
                  name="username"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        autoComplete="off"
                        placeholder="Vui lòng nhập tên đăng nhập..."
                        className="w-full rounded-md border border-stroke bg-transparent py-3 pl-4 pr-20 text-black outline-none focus:border-primary focus-visible:shadow-none"
                      />

                      <span className="absolute right-5 top-1/2 transform -translate-y-1/2">
                        <User className="text-base text-zinc-500" />
                      </span>
                    </div>
                  )}
                />
                {errors.username?.message && (
                  <p className="text-sm text-red-500">
                    {errors.username?.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Mật khẩu
                </label>
                <Controller
                  defaultValue=""
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        type={modifyPassword.type}
                        placeholder="Vui lòng nhập mật khẩu..."
                        {...field}
                        className="w-full rounded-md border border-stroke bg-transparent py-3 pl-4 pr-20 text-black outline-none focus:border-primary focus-visible:shadow-none"
                      />

                      <span className="absolute right-5 top-1/2 transform -translate-y-1/2">
                        <modifyPassword.icon
                          className="text-base text-zinc-500 cursor-pointer"
                          onClick={() => handleModifyPassword()}
                        />
                      </span>
                    </div>
                  )}
                />
                {errors.password?.message && (
                  <p className="text-sm text-red-500">
                    {errors.password?.message}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <Button
                  type="submit"
                  className="w-full relative bg-primary text-white font-bold overflow-hidden group"
                >
                  <span className="relative z-10">Đăng nhập</span>
                  <span
                    className="absolute left-[-100%] top-0 w-[20%] h-full bg-white/30 -skew-x-[45deg]
               transition-all duration-700 group-hover:left-[110%]"
                  />
                </Button>
              </div>
            </form>
          </div>
          <p className="text-sm text-zinc-500">
            Copyright © 2025 DIDOTEK. All rights reserved
          </p>
        </div>
      </div>
      {loading && <Loader type="inside" />}
    </>
  );
};

export default Login;
