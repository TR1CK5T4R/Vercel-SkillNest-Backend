import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Course Schema (match your course.model.js)
const courseSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // Duration in minutes
        required: true
    }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

// Sample courses data
const sampleCourses = [
    {
        title: "Complete Web Development Bootcamp",
        description: "Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB from scratch. Build real-world projects and become a full-stack developer.",
        category: "Web Development",
        price: 4999,
        duration: 3600, // 60 hours
        videoFile: "https://res.cloudinary.com/demo/video/upload/sample.mp4"
    },
    {
        title: "Python for Data Science",
        description: "Master Python programming for data analysis, visualization, and machine learning. Includes NumPy, Pandas, and Scikit-learn.",
        category: "Data Science",
        price: 3999,
        duration: 2400, // 40 hours
        videoFile: "https://res.cloudinary.com/demo/video/upload/sample.mp4"
    },
    {
        title: "React - The Complete Guide",
        description: "Deep dive into React including Hooks, Context API, Redux, Next.js, and advanced patterns. Build modern web applications.",
        category: "Web Development",
        price: 2999,
        duration: 3000, // 50 hours
        videoFile: "https://res.cloudinary.com/demo/video/upload/sample.mp4"
    },
    {
        title: "UI/UX Design Masterclass",
        description: "Learn user interface and user experience design principles. Master Figma, create wireframes, prototypes, and design systems.",
        category: "Design",
        price: 3499,
        duration: 1800, // 30 hours
        videoFile: "https://res.cloudinary.com/demo/video/upload/sample.mp4"
    },
    {
        title: "Machine Learning A-Z",
        description: "Comprehensive machine learning course covering supervised and unsupervised learning, neural networks, and deep learning.",
        category: "Data Science",
        price: 5999,
        duration: 4200, // 70 hours
        videoFile: "https://res.cloudinary.com/demo/video/upload/sample.mp4"
    },
    {
        title: "Digital Marketing Complete Course",
        description: "Master SEO, social media marketing, email marketing, content marketing, and analytics. Grow your business online.",
        category: "Marketing",
        price: 2499,
        duration: 2000, // 33 hours
        videoFile: "https://res.cloudinary.com/demo/video/upload/sample.mp4"
    },
    {
        title: "iOS App Development with Swift",
        description: "Build iOS apps from scratch using Swift and SwiftUI. Learn Xcode, design patterns, and publish to the App Store.",
        category: "Mobile Development",
        price: 4499,
        duration: 3200, // 53 hours
        videoFile: "https://res.cloudinary.com/demo/video/upload/sample.mp4"
    },
    {
        title: "Graphic Design Fundamentals",
        description: "Learn typography, color theory, layout design, and branding. Master Adobe Photoshop and Illustrator.",
        category: "Design",
        price: 1999,
        duration: 1500, // 25 hours
        videoFile: "https://res.cloudinary.com/demo/video/upload/sample.mp4"
    },
    {
        title: "AWS Cloud Practitioner",
        description: "Get started with Amazon Web Services. Learn EC2, S3, Lambda, RDS, and prepare for AWS certification.",
        category: "Cloud Computing",
        price: 3299,
        duration: 2200, // 36 hours
        videoFile: "https://res.cloudinary.com/demo/video/upload/sample.mp4"
    },
    {
        title: "Ethical Hacking & Cybersecurity",
        description: "Learn penetration testing, network security, cryptography, and security best practices. Become a certified ethical hacker.",
        category: "Cybersecurity",
        price: 5499,
        duration: 3800, // 63 hours
        videoFile: "https://res.cloudinary.com/demo/video/upload/sample.mp4"
    }
];

// Seed function
const seedCourses = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing courses (optional - comment out if you want to keep existing)
        await Course.deleteMany({});
        console.log('🗑️  Cleared existing courses');

        // Insert sample courses
        const insertedCourses = await Course.insertMany(sampleCourses);
        console.log(`✅ Successfully seeded ${insertedCourses.length} courses!`);

        // Display inserted courses
        console.log('\n📚 Courses added:');
        insertedCourses.forEach((course, index) => {
            console.log(`${index + 1}. ${course.title} - ₹${course.price}`);
        });

        // Disconnect
        await mongoose.disconnect();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding courses:', error);
        process.exit(1);
    }
};


seedCourses();