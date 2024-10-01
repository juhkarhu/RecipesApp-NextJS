import RecipeDetail from '../../components/RecipeDetail';

interface RecipeDetailPageProps {
  params: { id: string };
}

const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({ params }) => {
  return <RecipeDetail recipeId={params.id} />;
};

export default RecipeDetailPage;
