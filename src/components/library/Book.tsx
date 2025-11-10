import Image from 'next/image';

const BookLibrary = () => {

    return (
        <div>
            <div className="flex flex-col items-center justify-center mt-16">
                <Image
                    src="/images/not-found.png"
                    alt="No Data"
                    width={200}
                    height={200}
                />
                <p className="mt-4 text-lg font-semibold">No Data Found</p>
            </div>
        </div>
    );
};

export default BookLibrary;
