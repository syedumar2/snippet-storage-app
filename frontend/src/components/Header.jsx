import { Button } from "./ui/button"



const Header = ({user, handleLogout}) => {
  return (
    <div className="bg-gray-600 text-white p-4 flex justify-between items-center rounded-b-2xl">
                {user ? (
                    <div className="text-xl font-semibold ml-3">
                        Welcome User: {user.username}
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
                <Button className="cursor-pointer" onClick={handleLogout}>Log out</Button>
            </div>
  )
}

export default Header