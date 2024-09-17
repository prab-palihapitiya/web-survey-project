const Page = ({ params }: { params: { surveyid: string } }) => {
    return (
        <div>
            <h1>{params.surveyid} Survey Test Page</h1>
        </div>
    );
};

export default Page;