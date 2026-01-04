import Table from '@/app/components/Table/Table' 

type DataObject = {
    id: number;
    name: string;
    category: string;
}

export default function HomeSection() {

    return (
        <div className="w-full h-full flex flex-col gap-4 p-6">
            <h1 className="text-3xl font-bold mb-4">React Development Showcase</h1>
            
            <div className="text-xl text-gray-600 mb-2">
            Built with: Next.js, Redux Toolkit, Formik, and Design Patterns
            </div>

            <p className="text-base text-gray-700 leading-relaxed max-w-3xl">
            This demo application showcases modern React development practices by combining industry-standard tools and architectural patterns.
            </p>
            <p className="text-base text-gray-700 leading-relaxed max-w-3xl">
            The philosophy behind this project is to demonstrate how proper state management with <strong>Redux Toolkit</strong>, form handling with <strong>Formik</strong>, and <strong>Next.js</strong> conventions can work together to create scalable, maintainable applications.
            </p>
            <p className="text-base text-gray-700 leading-relaxed max-w-3xl">
            By implementing common design patterns and best practices, this example serves as a reference for building production-ready React applications that prioritize code organization, reusability, and developer experience.
            </p>
        </div>
    )
}
