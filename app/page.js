import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Charity Donation Tracker</h1>
        <p className="mt-4 text-lg">
          Track your donations and manage expenses effectively!
        </p>
        <Link href="/donate">
          <span className="mt-6 inline-block px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Make a Donation
          </span>
        </Link>
      </div>

      {/* Overview of Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">Donation Tracking</h2>
          <p>View your donations and their purposes easily.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">Expense Logging</h2>
          <p>Log and track expenses for transparency.</p>
        </div>
        {/* Add more feature descriptions as needed */}
      </div>

      {/* Navigation Menu */}
      <nav className="mt-10">
        <ul className="flex space-x-4">
          <li>
            <Link href="/donate">
              <span className="text-blue-500 hover:underline">
                Make Donation
              </span>
            </Link>
          </li>
          <li>
            <Link href="/view-donations">
              <span className="text-blue-500 hover:underline">
                {" "}
                View Donations
              </span>
            </Link>
          </li>
          <li>
            <Link href="/log-expense">
              <span className="text-blue-500 hover:underline">
                {" "}
                Log Expense
              </span>
            </Link>
          </li>
          <li>
            <Link href="/view-expenses">
              <span className="text-blue-500 hover:underline">
                View Expenses
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
