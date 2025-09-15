import Image from "next/image";

export default function NotFoundPage() {
    return (
        <div className="flex m-auto flex-col items-center justify-center text-center">
            <Image
                src="/images/not-found.png"
                alt="Not Found"
                width={200}
                height={200}
                className="w-40 h-40 mb-6"
            />
            <h2 className="text-xl font-semibold mb-2">Not Found</h2>
            <p className="text-sm text-gray-500 max-w-xs">
                Sorry, the keyword you entered cannot be found, please check again or
                search with another keyword.
            </p>
        </div>
    );
}
