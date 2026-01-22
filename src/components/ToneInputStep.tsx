import { ArrowLeft, ArrowRight, Plus, Sparkles, X } from 'lucide-react';
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
        <div className="bg-gray-900/50 backdrop-blur-sm p-8 sm:p-10 rounded-3xl border border-gray-800/50 w-full max-w-3xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center">
                    <Sparkles className="w-7 h-7 mr-3 text-orange-400" />
                    Tone Profile Input
                </h2>
                <p className="text-white/60 text-sm">
                    Provide {MIN_POSTS}-{MAX_POSTS} examples of your existing social media posts to capture your unique voice
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

                {posts.map((post, index) => (
                    <div key={index} className="group">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-white/90">
                                Post {index + 1}
                                {index < MIN_POSTS && <span className="text-orange-400 ml-1">*</span>}
                            </label>
                            {posts.length > MIN_POSTS && (
                                <button
                                    type="button"
                                    onClick={() => handleRemovePost(index)}
                                    className="text-white/40 hover:text-orange-400 transition-colors"
                                    title="Remove Post"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <textarea
                            value={post}
                            onChange={(e) => handlePostChange(index, e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all resize-none"
                            placeholder={`Paste an example post from your social media... ${index < MIN_POSTS ? '(Required)' : '(Optional)'}`}
                        />
                    </div>
                ))}

                {posts.length < MAX_POSTS && (
                    <button
                        type="button"
                        onClick={handleAddPost}
                        className="flex items-center text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add another post ({posts.length}/{MAX_POSTS})
                    </button>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t border-gray-800/50 mt-6">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex items-center justify-center px-6 py-3 rounded-xl text-white/90 font-semibold bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`flex items-center justify-center px-8 py-3 rounded-xl text-white font-semibold transition-all
                            ${isValid
                                ? 'bg-orange-500/90 hover:bg-orange-500 shadow-lg shadow-orange-500/20'
                                : 'bg-gray-800 cursor-not-allowed opacity-50'}`}
                    >
                        Generate Strategy
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ToneInputStep;
