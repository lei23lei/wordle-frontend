export default function Footer() {
  return (
    <div className="text-center md:text-end w-full px-10">
      {/* designed and build by Lei Ieong Tam */}
      <p className="text-sm text-gray-600 dark:text-gray-400 ">
        &copy; {new Date().getFullYear()} Lei Ieong Tam. All rights reserved.
      </p>
    </div>
  );
}
