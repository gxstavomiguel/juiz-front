import { useState, useCallback } from 'react'
import type { LoadingState } from '@/types'

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<LoadingState & { data?: T }>({
    isLoading: false,
    error: undefined,
    data: undefined,
  })

  const execute = useCallback(async (apiCall: () => Promise<any>) => {
    setState(prev => ({ ...prev, isLoading: true, error: undefined }))

    try {
      const response = await apiCall()
      
      if (response.success) {
        setState({
          isLoading: false,
          error: undefined,
          data: response.data,
        })
        
        if (options.onSuccess) {
          options.onSuccess(response.data)
        }
        
        return response.data
      } else {
        const error = response.error || 'Erro desconhecido'
        setState({
          isLoading: false,
          error,
          data: undefined,
        })
        
        if (options.onError) {
          options.onError(error)
        }
        
        throw new Error(error)
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido'
      setState({
        isLoading: false,
        error: errorMessage,
        data: undefined,
      })
      
      if (options.onError) {
        options.onError(errorMessage)
      }
      
      throw error
    }
  }, [options])

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: undefined,
      data: undefined,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

