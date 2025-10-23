import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import externalLink from "../assets/icons/externalLink.svg";

const Navbar = () => {
  return (
    <>
      <div className="w-full px-4 lg:px-[80px] py-4 border-b-[0.72px] border-white border-opacity-10 inline-flex justify-start items-center gap-3">
        <div className="flex w-full justify-between items-center">
          <div className="lg:w-[800px] flex items-center justify-start lg:justify-between">
            {/* logo part */}
            <div className="flex justify-start items-center gap-3">
              <div>
                <div className="cursor-pointer flex items-center justify-center gap-1">
                  <img src={logo} alt="" className="h-[32px] w-[32px]" />
                  <span className="hidden md:inline-flex text-[24px] font-medium">
                    Dashboard
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* to spiral stake */}
          <Link
            target="blank"
            to={"https://app.spiralstake.xyz/products"}
            className="flex items-center h-full gap-[4px] px-[14px] py-[10px] rounded-[999px] bg-white bg-opacity-[12%]"
          >
            <p className="text-[14px]">Spiral Stake</p>
            <img src={externalLink} alt="" className="w-[16px] h-[16px]" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
