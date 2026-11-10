import MyRecipes from '../../components/profile/MyRecipes'
import UserInfo from '../../components/profile/UserInfo'
import UsageReport from '../../components/profile/UsageReport'
import ChangePlan from '../../components/profile/ChangePlan'
import DeleteAccount from '../../components/profile/DeleteAccount'

const ProfilePage = () => {
  return (
    <section>
      <UserInfo />
      <div className="profile-plan">
        <UsageReport />
        <ChangePlan />
      </div>
      <MyRecipes />
      <DeleteAccount />
    </section>
  )
}

export default ProfilePage
