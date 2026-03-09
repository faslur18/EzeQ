import Link from "next/link"
import Icon from "@/components/ui/icon"

interface SalonCardProps {
    id: string
    name: string
    address: string
    rating: number
    profileImage?: string
}

export default function SalonCard({ id, name, address, rating, profileImage }: SalonCardProps) {
    return (
        <Link href={`/salon/${id}`} className="group block h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-none border-2 border-input bg-white transition-all hover:border-black hover:-translate-y-1">
                {/* Image Placeholder */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden border-b-2 border-input group-hover:border-black transition-colors">
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt={name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                            <Icon name="palette" size="xl" />
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border-2 border-black px-2 py-1 flex items-center gap-1">
                        <Icon name="star" size="sm" className="text-yellow-500 filled" />
                        <span className="text-xs font-black">{rating.toFixed(1)}</span>
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                        <h3 className="mb-2 text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {name}
                        </h3>
                        <p className="text-slate-500 text-sm flex items-start gap-1">
                            <Icon name="location_on" size="sm" className="mt-0.5 text-slate-400" />
                            <span className="line-clamp-2">{address}</span>
                        </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Professional Salon
                        </span>
                        <div className="flex items-center text-sm font-bold text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight">
                            Book Now <Icon name="arrow_forward" size="sm" className="ml-1" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
