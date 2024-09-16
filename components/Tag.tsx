import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'

type TagProps = {
  year: string
}

const Tag = ({ year }: TagProps) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })

  return (
    <div
      className={cn(
        'reveal sticky top-5 z-10 mx-auto rounded-full bg-white-1 px-3 py-1 text-xs font-bold text-zinc-500 first-of-type:mt-10',
        { 'animate-revealSm': inView },
      )}
      ref={ref}
    >
      {year}
    </div>
  )
}

export default Tag
