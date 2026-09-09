export default function UserListShimmer() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f7f5ef]">
      {/* Sidebar */}
      <div className="w-90 shrink-0 border-r border-gray-200 bg-white">
        {/* Header */}
        <div className="h-23 border-b border-gray-200 bg-[#f0f2f5] px-6 py-7">
          <div className="h-7 w-24 animate-pulse rounded-md bg-gray-300" />
        </div>

        {/* Search */}
        <div className="px-4 py-2">
          <div className="h-12 animate-pulse rounded-lg bg-gray-200" />
        </div>

        {/* Users */}
        <div className="px-4">
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div key={item} className="flex h-22 items-center gap-4 border-b border-gray-200 px-1">
              {/* Avatar */}
              <div className="size-15 shrink-0 animate-pulse rounded-full bg-gray-200" />

              {/* User info */}
              <div className="min-w-0 flex-1">
                <div className="mb-3 h-5 w-32 animate-pulse rounded bg-gray-200" />

                <div className="h-4 w-44 animate-pulse rounded bg-gray-200" />
              </div>

              {/* Time */}
              <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex h-17 items-center gap-4 border-b border-gray-200 bg-[#f0f2f5] px-6">
          <div className="size-11 animate-pulse rounded-full bg-gray-300" />

          <div>
            <div className="mb-2 h-4 w-28 animate-pulse rounded bg-gray-300" />
            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-hidden px-8 py-8">
          {/* Left message */}
          <div className="flex justify-start">
            <div className="h-12 w-52 animate-pulse rounded-lg bg-gray-200" />
          </div>

          {/* Right message */}
          <div className="flex justify-end">
            <div className="h-16 w-64 animate-pulse rounded-lg bg-gray-200" />
          </div>

          {/* Left message */}
          <div className="flex justify-start">
            <div className="h-10 w-72 animate-pulse rounded-lg bg-gray-200" />
          </div>

          {/* Right message */}
          <div className="flex justify-end">
            <div className="h-20 w-56 animate-pulse rounded-lg bg-gray-200" />
          </div>

          {/* Left message */}
          <div className="flex justify-start">
            <div className="h-14 w-48 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>

        {/* Message Input */}
        <div className="flex h-17 items-center gap-3 border-t border-gray-200 bg-[#f0f2f5] px-6">
          <div className="h-11 flex-1 animate-pulse rounded-lg bg-gray-200" />
          <div className="size-11 animate-pulse rounded-full bg-gray-300" />
        </div>
      </div>
    </div>
  )
}
