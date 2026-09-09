export default function StatusListShimmer() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f7f5ef]">

      {/* Left Sidebar */}
      <div className="w-90 shrink-0 border-r border-gray-200 bg-[#f7f5ef]">

        {/* Header */}
        <div className="flex h-23 items-center justify-between px-9">
          <div className="h-8 w-28 animate-pulse rounded-md bg-gray-300" />

          {/* Plus Button */}
          <div className="size-10 animate-pulse rounded-full bg-gray-300" />
        </div>

        {/* My Status */}
        <div className="flex items-center gap-5 px-9 py-5">
          {/* Avatar */}
          <div className="size-17 shrink-0 animate-pulse rounded-full bg-gray-300" />

          <div>
            <div className="mb-3 h-5 w-28 animate-pulse rounded bg-gray-300" />
            <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Recent Updates Title */}
        <div className="px-9 pb-3 pt-7">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-300" />
        </div>

        {/* Status Users */}
        <div className="overflow-hidden px-9">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="flex h-25 items-center gap-5"
            >
              {/* Avatar */}
              <div className="size-15 shrink-0 animate-pulse rounded-full bg-gray-200" />

              {/* User Info */}
              <div className="flex-1">
                <div className="mb-3 h-5 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center bg-[#f7f7f7]">

        <div className="flex flex-col items-center">

          {/* Icon Circle */}
          <div className="mb-8 size-20 animate-pulse rounded-full bg-gray-200" />

          {/* Heading */}
          <div className="mb-5 h-8 w-56 animate-pulse rounded bg-gray-200" />

          {/* Description */}
          <div className="h-5 w-120 max-w-[80vw] animate-pulse rounded bg-gray-200" />

        </div>
      </div>

    </div>
  )
}