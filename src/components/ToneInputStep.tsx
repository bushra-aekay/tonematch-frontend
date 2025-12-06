import { ArrowLeft, ArrowRight, Plus, Rss, X } from 'lucide-react';
import { FC, FormEvent, useState } from 'react';

interface ToneInputStepProps {
    onNext: (data: any) => void;
    onBack: () => void;
    initialData: any;
}

const MIN_POSTS = 3;
const MAX_POSTS = 5;

const ToneInputStep: FC<ToneInputStepProps> = ({ onNext, onBack, initialData }) => {
    
    const initialPosts = initialData.toneExamples || Array(MIN_POSTS).fill('');
    const [posts, setPosts] = useState<string[]>(initialPosts.slice(0, MAX_POSTS));
    // Check if the first MIN_POSTS posts have content
    const isValid = posts.slice(0, MIN_POSTS).every(post => post.trim().length > 10);

    const handlePostChange = (index: number, value: string) => {
        const newPosts = [...posts];
        newPosts[index] = value;
        setPosts(newPosts);
    };

    const handleAddPost = () => {
        if (posts.length < MAX_POSTS) {
            setPosts([...posts, '']);
        }
    };

    const handleRemovePost = (index: number)=> {
        if(posts.length > MIN_POSTS){
            setPosts(posts.filter((_, i) => i != index));
        }
    }
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isValid) {
            // Filter out empty strings before submission
            const validPosts = posts.filter(post => post.trim().length > 0);
            onNext({ toneExamples: validPosts });
        }
    };
    return (
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Rss className="w-7 h-7 mr-3 text-purple-600" />
                Step 2: Tone Profile Input
            </h2>
            <p className="text-gray-500 mb-6">
                Please provide **{MIN_POSTS} to {MAX_POSTS} examples** of your existing social media posts. The AI will analyze this to capture your unique voice.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {posts.map((post, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <label className="text-sm font-semibold text-gray-700 mt-2 shrink-0 w-8">
                            Post {index + 1}:
                            {index < MIN_POSTS && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                            value={post}
                            onChange={(e) => handlePostChange(index, e.target.value)}
                            rows={3}
                            className="grow px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 resize-none"
                            placeholder={`Example post content (${index < MIN_POSTS ? 'Required' : 'Optional'})`}
                        />
                        {posts.length > MIN_POSTS && (
                            <button
                                type="button"
                                onClick={() => handleRemovePost(index)}
                                className="mt-2 text-red-500 hover:text-red-700"
                                title="Remove Post"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))}
                
                {posts.length < MAX_POSTS && (
                    <button
                        type="button"
                        onClick={handleAddPost}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add another post ({posts.length}/{MAX_POSTS})
                    </button>
                )}

                <div className="flex justify-between items-center pt-4 border-t mt-6">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex items-center px-4 py-2 rounded-xl text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 transition"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Details
                    </button>
                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`flex items-center px-6 py-3 rounded-xl text-white font-semibold transition-colors 
                            ${isValid ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        Analyze & Generate Strategy
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ToneInputStep;