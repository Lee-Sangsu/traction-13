import Image from "next/image"
import { ApplicationButton } from "@/components/application-button"

export function Footer() {
  return (
    <footer className="w-full relative overflow-hidden">
      {/* Background Image */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[780px]">
        <Image
          src="/img/footer.png"
          alt="Traction 13 Footer"
          fill
          className="object-cover"
          priority={false}
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-end px-5 text-center max-w-7xl mx-auto">
          {/* Top Badge */}
          <div className="inline-block bg-primary rounded-full px-6 py-2 mb-6 w-fit">
            <p className="text-xs md:text-sm font-ibm-plex-mono uppercase text-white">
              Don't forget to book you slot
            </p>
          </div>

          {/* Main Heading */}
          <h2 className="flex flex-row items-center text-5xl md:text-6xl lg:text-8xl text-white mb-8 leading-tight">
            <Image src="/icons/bnomad-logo.svg" alt="BNomad" width={100} height={100} 
              className="text-white w-10 h-10 md:w-32 md:h-32" />
            <span className="mx-3 md:mx-4">×</span>
            <Image src="/icons/logo.svg" alt="Traction 13" width={540} height={128} 
              className="text-white w-10 h-10 md:w-fit md:h-32" />
          </h2>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 text-xs md:text-sm font-helvetica items-center justify-between mb-12 text-white">
            <a href="#" className="hover:text-primary transition-colors">Hybrid format</a>
            
            <div className="flex flex-wrap gap-4 md:gap-8">
              <a href="#" className="hover:text-primary transition-colors">CONTACT SALES</a>
              <a href="#" className="hover:text-primary transition-colors">NEWSROOM/STORIES</a>
            </div>
          </div>

          {/* Bottom Links */}
        </div>
      </div>
    </footer>
  )
}
