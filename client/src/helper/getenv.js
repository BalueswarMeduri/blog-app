export const getenv = (eventNames) => {
    const env = import.meta.env
    return env[`VITE_${eventNames}`]
}