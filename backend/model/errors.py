class ModelNotFound(Exception):
    """
    No se ha podido ejecutar la petición realizada.
    """

    def __init__(self, message):
        self.message = message
