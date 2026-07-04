import { useKeycloak } from "@react-keycloak/web";

export default function SecurePage() {
    const { keycloak } = useKeycloak();
    return (
        <div className="secure-page">
            <p>Welcome, {keycloak.tokenParsed.email}</p>
            <p>Your access token (keep it safe!): {keycloak.token}</p>
        </div>
    );
}