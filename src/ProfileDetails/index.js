import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

const apiConstants = {
  success: 'SUCCESS',
  failuer: 'FAILURE',
  initial: 'INITIAL',
  in_progress: 'IN_PROGRESS',
}

class ProfileCard extends Component {
  state = {profileData: [], apiStatus: apiConstants.initial}

  componentDidMount() {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiConstants.in_progress})
    const token = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const profileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({apiStatus: apiConstants.success, profileData})
    } else {
      this.setState({apiStatus: apiConstants.failuer})
    }
  }

  renderProfileView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="bg-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="heading">{name}</h1>
        <p className="para">{shortBio}</p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="profile-error-view-container">
      <button
        type="button"
        id="button"
        className="fail-button"
        onClick={this.getProfile}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.success:
        return this.renderProfileView()
      case apiConstants.failuer:
        return this.renderFailureView()
      case apiConstants.in_progress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}
export default ProfileCard
