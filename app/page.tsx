import { AnimatedText } from "@/components/common/AnimatedText";
import { BackdropBlur } from "@/components/layout/BackdropBlur";
import { ContentWrapper } from "@/components/layout/ContentWrapper";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";

export default function Home() {
  return (
    <>
      <Sidebar/>
      <ContentWrapper>
        <div className="w-full flex items-center gap-4 p-4 border-b border-gray-300/50">
          <span className="font-semibold">
            <AnimatedText text="Review Status" lgSize />
          </span>
        </div>
      </ContentWrapper>
    </>
  );
}
